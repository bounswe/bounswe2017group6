package com.cmpe451.interesthub.fragments;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import com.cmpe451.interesthub.InterestHub;
import com.cmpe451.interesthub.R;
import com.cmpe451.interesthub.activities.ProfileActivity;
import com.cmpe451.interesthub.activities.UserActivity;
import com.cmpe451.interesthub.adapters.UserAdapter;
import com.cmpe451.interesthub.adapters.UserCardListAdapter;
import com.cmpe451.interesthub.models.Following_Followers;
import com.cmpe451.interesthub.models.User;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


/**
 * Created by mmervecerit on 22.11.2017.
 */

public class User_Following_Fragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private Handler mHandler;
    List<User> userList;
    InterestHub hub;
    RecyclerView list;
    private OnFragmentInteractionListener mListener;
    private long userid;
    public User_Following_Fragment(long userid) {
        this.userid=userid;
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        //return inflater.inflate(R.layout.fragment_user_following, container, false);
        View  view =inflater.inflate(R.layout.fragment_user_following, container, false);
        list = view.findViewById(R.id.userFollowingList);
        userList  = new ArrayList<User>();
        hub = (InterestHub) getActivity().getApplication();
        mHandler = new Handler();
        startRepeatingTask();

        return view;
    }

    public void refresh(long userid){
        if(userid==0) {
            hub.getApiService().getFollowings().enqueue(new Callback<List<User>>() {
                @Override
                public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                    if (response != null && response.body() != null)
                        userList = response.body();
                    setAdapter();
                }

                @Override
                public void onFailure(Call<List<User>> call, Throwable t) {

                }
            });
        }
        else{
            hub.getApiService().getFollowingsOfSomeone(userid).enqueue(new Callback<List<User>>() {
                @Override
                public void onResponse(Call<List<User>> call, Response<List<User>> response) {
                    if (response != null && response.body() != null)
                        userList = response.body();
                    setAdapter();
                }

                @Override
                public void onFailure(Call<List<User>> call, Throwable t) {

                }
            });
        }
    }
    public void setAdapter(){
        final LinearLayoutManager ll = new LinearLayoutManager( getActivity());
        ll.setOrientation(LinearLayoutManager.VERTICAL);
        list.setLayoutManager(ll);
        UserCardListAdapter.OnItemClickListener listener = new UserCardListAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(int pos) {
                Intent intent = new Intent(getContext(), ProfileActivity.class);
                intent.putExtra("userId", userList.get(pos).getId());
                startActivity(intent);


            }
        };
        final UserCardListAdapter adapter = new UserCardListAdapter(getContext(), userList, listener);
        list.setAdapter(adapter);
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
    void startRepeatingTask() {
        mStatusChecker.run();
    }

    void stopRepeatingTask() {
        mHandler.removeCallbacks(mStatusChecker);
    }
    Runnable mStatusChecker = new Runnable() {
        @Override
        public void run() {
            try {
                refresh(userid);
            } finally {

                mHandler.postDelayed(mStatusChecker, 5000);
            }
        }
    };
}

