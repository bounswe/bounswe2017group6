package com.cmpe451.interesthub.fragments;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.cmpe451.interesthub.R;
import com.cmpe451.interesthub.InterestHub;
import com.cmpe451.interesthub.activities.ContentActivity;
import com.cmpe451.interesthub.activities.UserActivity;
import com.cmpe451.interesthub.adapters.MultipleContentAdapter;
import com.cmpe451.interesthub.adapters.SingleContentAdapter;
import com.cmpe451.interesthub.models.Content;
import com.cmpe451.interesthub.models.Group;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by mmervecerit on 22.11.2017.
 */

public class User_MyPosts_Fragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM2 = "param1";
    private static final String ARG_PARAM3 = "param2";
    private Context context;
    RecyclerView postList;
    private InterestHub hub ;
    // TODO: Rename and change types of parameters
    private String mParam2;
    private String mParam3;

    private User_MyPosts_Fragment.OnFragmentInteractionListener mListener;
    private long userid;
    public User_MyPosts_Fragment(long userid) {
        this.userid = userid;
    }



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam2 = getArguments().getString(ARG_PARAM2);
            mParam3 = getArguments().getString(ARG_PARAM3);
        }
    }


    Content a;
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        final View view = inflater.inflate(R.layout.fragment_user_myposts, container, false);
        postList = (RecyclerView) view.findViewById(R.id.recycler_view);
        hub = (InterestHub) getActivity().getApplication();
        final List<Content> contentList = new ArrayList<Content>();
        long my_id = hub.getSessionController().getUser().getId();
        if(userid==0) {
            hub.getApiService().getUserContents(my_id).enqueue(new Callback<List<Content>>() {
                @Override
                public void onResponse(Call<List<Content>> call, Response<List<Content>> response) {
                    if (response.body() != null)
                        for (Content c : response.body()) {
                            contentList.add(c);

                        }
                    setAdapter(contentList);
                }

                @Override
                public void onFailure(Call<List<Content>> call, Throwable t) {
                }
            });
        }
        else{
            hub.getApiService().getUserContents(userid).enqueue(new Callback<List<Content>>() {
                @Override
                public void onResponse(Call<List<Content>> call, Response<List<Content>> response) {
                    if (response.body() != null)
                        for (Content c : response.body()) {

                            contentList.add(c);

                        }
                    setAdapter(contentList);
                }

                @Override
                public void onFailure(Call<List<Content>> call, Throwable t) {

                }
            });
        }
        return view;
    }
        // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }
    public void setAdapter(final List<Content> contentList){
        final LinearLayoutManager ll = new LinearLayoutManager(getActivity());
        ll.setOrientation(LinearLayoutManager.VERTICAL);
        MultipleContentAdapter.OnItemClickListener listener = new MultipleContentAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(int pos) {
                hub.setTempContent(contentList.get(pos));
                Intent intent = new Intent(getContext(), ContentActivity.class);
                startActivity(intent);
            }
        };
        MultipleContentAdapter adapter = new MultipleContentAdapter(getContext(),contentList,listener,hub);

        postList.setLayoutManager(ll);

        postList.setAdapter(adapter);
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
}

